from django import template
from mysite.models import *

register = template.Library()


@register.filter(name='user_in')
def user_in(objects, user):
    if user.is_authenticated:
        if objects:
            return objects.filter(user=user).exists()
    return False


register.filter('user_in', user_in)
