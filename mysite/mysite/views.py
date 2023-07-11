import json

from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.contrib.auth.views import LoginView
from django.views.generic import CreateView, View
from django.urls import reverse_lazy

from .forms import *
from .models import *

menu = [
    {
        'title': "Главная",
        'url_name': 'home'
    },
    {
        'title': "Отзывы",
        'url_name': 'feedback'
    },
    {
        'title': "Войти",
        'url_name': 'auth'
    },
]


def index(request):
    context = {
        'title': "Главная",
        'menu': menu,
    }

    return render(request, 'mysite/index.html', context=context)


class RegisterUser(CreateView):
    form_class = RegisterUserForm
    template_name = 'mysite/register.html'
    success_url = reverse_lazy('auth')

    def get_context_data(self, *, object_list=None, **kwargs):
        context = super().get_context_data(**kwargs)
        c_def = {'title': "Регистрация"}
        return dict(list(context.items()) + list(c_def.items()))


class LoginUser(LoginView):
    form_class = LoginUserForm
    template_name = 'mysite/authorization.html'

    def get_context_data(self, *, object_list=None, **kwargs):
        context = super().get_context_data(**kwargs)
        c_def = {'title': "Авторизация"}
        return dict(list(context.items()) + list(c_def.items()))

    def get_success_url(self):
        return reverse_lazy('home')


def feedback(request):
    if request.method == 'POST':
        form = FeedBackForm(request.POST)

        if form.is_valid():

            FeedBack.objects.create(user=request.user,
                                    text=form.cleaned_data['text'])
            return redirect('feedback')

    else:
        form = FeedBackForm()

    context = {
        'title': "Отзывы",
        'menu': menu,
        'form': form,
        'feedbacks': FeedBack.objects.all(),
    }

    return render(request, 'mysite/feedback.html', context=context)


def logout(request):
    return HttpResponse("Заглушка")


class VotesView(View):
    model = None  # Модель данных - Отзывы
    vote_type = None  # Тип комментария Like/Dislike

    def post(self, request, pk):
        obj = self.model.objects.get(pk=pk)
        # GenericForeignKey не поддерживает метод get_or_create
        try:
            likedislike = LikeDislike.objects.get(
                content_type=ContentType.objects.get_for_model(obj),
                object_id=obj.id,
                user=request.user)
            if likedislike.vote is not self.vote_type:
                likedislike.vote = self.vote_type
                likedislike.save(update_fields=['vote'])
                result = True
            else:
                likedislike.delete()
                result = False
        except LikeDislike.DoesNotExist:
            obj.votes.create(user=request.user, vote=self.vote_type)
            result = True

        return HttpResponse(json.dumps({
            "result":
            result,
            "like_count":
            obj.votes.likes().count(),
            "dislike_count":
            obj.votes.dislikes().count(),
            "sum_rating":
            obj.votes.sum_rating()
        }), content_type="application/json")


class UpdateView(View):
    model = None

    def post(self, request, pk):
        obj = self.model.objects.get(pk=pk)

        return HttpResponse(json.dumps({
            "like_count":
            obj.votes.likes().count(),
            "dislike_count":
            obj.votes.dislikes().count(),
        }), content_type="application/json")


# def delete(request):
#     context = {
#         'title': "Отзывы",
#         'menu': menu,
#         'feedbacks': FeedBack.objects.all(),
#     }
#
#     id = request.GET.get("id")
#
#     obj = FeedBack.objects.get(pk=id)
#     obj.delete()
#
#     return render(request, 'mysite/feedback.html', context=context)
