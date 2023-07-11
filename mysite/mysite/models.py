from django.db import models
from django.contrib.auth.models import User
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey, GenericRelation
from django.db.models import Sum


class LikeDislikeManager(models.Manager):
    use_for_related_fields = True

    def likes(self):
        # Забираем queryset с записями больше 0
        return self.get_queryset().filter(vote__gt=0)

    def dislikes(self):
        # Забираем queryset с записями меньше 0
        return self.get_queryset().filter(vote__lt=0)

    def sum_rating(self):
        # Забираем суммарный рейтинг
        return self.get_queryset().aggregate(Sum('vote')).get('vote__sum') or 0

    def feedbacks(self):
        return self.get_queryset().filter(
            content_type__model='feedback').order_by('-comments__pub_date')


class LikeDislike(models.Model):
    LIKE = 1
    DISLIKE = -1

    VOTES = ((DISLIKE, 'Не нравится'), (LIKE, 'Нравится'))

    vote = models.SmallIntegerField(verbose_name=("Голос"), choices=VOTES)
    user = models.ForeignKey(User,
                             verbose_name=("Пользователь"),
                             on_delete=models.CASCADE)

    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey()

    objects = LikeDislikeManager()

    def __str__(self):
        return f"{self.user} - like/dislike №{self.pk} to post №{self.content_object.pk}"

    class Meta:
        verbose_name = "Оценка"
        verbose_name_plural = "Оценки"


class FeedBack(models.Model):
    user = models.ForeignKey(User,
                             verbose_name="Пользователь",
                             on_delete=models.CASCADE)
    text = models.CharField(max_length=512, verbose_name='Текст отзыва')
    votes = GenericRelation(LikeDislike, related_query_name='feedbacks')

    def __str__(self):
        return f"{self.user} - feedback №{self.pk}"

    class Meta:
        verbose_name = "Отзыв"
        verbose_name_plural = "Отзывы"
