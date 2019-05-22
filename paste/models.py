from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Paste(models.Model):
    guest  = models.BooleanField(default=True)
    slug   = models.SlugField(max_length=7, unique=True, primary_key=True)
    text   = models.TextField(max_length=10000)
    date   = models.DateTimeField(auto_now_add=True)
    poster = models.ForeignKey(User, on_delete=models.CASCADE, null=True)

    remove_key = models.CharField(max_length=32)