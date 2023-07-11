from django import forms
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth.models import User
from .models import *
#from django.core.exceptions import ValidationError


class RegisterUserForm(UserCreationForm):
    username = forms.CharField(
        label='Имя пользователя',
        widget=forms.TextInput(attrs={
            'type': "text",
            'id': "username",
            'minlength': "3"
        }))
    email = forms.EmailField(
        label='Адрес электронной почты',
        widget=forms.EmailInput(
            attrs={
                'type': "email",
                'name': "email",
                'id': "mail",
                'title': "Пример адреса электронной почты: example@mail.com"
            }))
    password1 = forms.CharField(label='Пароль',
                                widget=forms.PasswordInput(
                                    attrs={
                                        'type': "password",
                                        'id': "password",
                                        'maxlength': "100",
                                        'minlength': "8"
                                    }))
    password2 = forms.CharField(label='Повторите пароль',
                                widget=forms.PasswordInput(
                                    attrs={
                                        'type': "password",
                                        'id': "password_repeat",
                                        'maxlength': "100",
                                        'minlength': "8"
                                    }))

    class Meta:
        model = User
        fields = ('username', 'email', 'password1', 'password2')


class LoginUserForm(AuthenticationForm):
    username = forms.CharField(label='Имя пользователя',
                               widget=forms.TextInput(attrs={
                                   'type': "text",
                                   'id': "username"
                               }))
    password = forms.CharField(label='Пароль',
                               widget=forms.PasswordInput(
                                   attrs={
                                       'type': "password",
                                       'id': "password",
                                       'maxlength': "100",
                                       'minlength': "8"
                                   }))


class FeedBackForm(forms.ModelForm):
    text = forms.CharField(max_length=512,
                           widget=forms.Textarea(attrs={
                               'cols': 40,
                               'rows': 5,
                               'class': 'form-input'
                           }),
                           label="Текст отзыва:")

    class Meta:
        model = FeedBack
        fields = ('text', )
