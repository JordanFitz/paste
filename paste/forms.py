from random import randint, random
from hashlib import md5
from django.utils import timezone

from django import forms
from .models import Paste

class PasteForm(forms.ModelForm):
    def save(self, guest=True, user=None):
        paste = super(PasteForm, self).save(commit=False)
        paste.guest = guest
        paste.remove_key = md5(str(random()).encode('utf-8')).hexdigest()
        paste.date = timezone.now()
        print(paste.date)
        paste.poster = user
        
        slug = ""
        for i in range(7):
            slug += str(randint(0, 9))

        paste.slug = slug;

        return paste

    class Meta:
        model = Paste
        fields = ('text',)