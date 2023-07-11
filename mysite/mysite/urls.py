from django.urls import path
from django.contrib.auth import views
from django.contrib.auth.decorators import login_required

from .views import *
from .models import LikeDislike, FeedBack

urlpatterns = [
    path('', index, name='home'),
    path('register/', RegisterUser.as_view(), name='register'),
    path('auth/', LoginUser.as_view(), name='auth'),
    path('feedback/', feedback, name='feedback'),
    path('logout/', views.LogoutView.as_view(next_page='home'), name='logout'),
    path('feedback/<pk>/like/',
        login_required(VotesView.as_view(model=FeedBack, vote_type=LikeDislike.LIKE)),
        name='comment_like'),
    path('feedback/<pk>/dislike/',
        login_required(VotesView.as_view(model=FeedBack, vote_type=LikeDislike.DISLIKE)),
        name='comment_dislike'),
    path('feedback/<pk>/update/', login_required(UpdateView.as_view(model=FeedBack)), name='update')
    # path('feedback/delete', delete, name='delete'),
]
