from django.urls import path, re_path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('log-in', views.log_in),
    path('sign-up', views.sign_up),
    path('log-out', views.log_out),
    path('create-paste', views.create_paste),
    path('pastes', views.list_pastes),
    re_path(r'^([0-9]{7})/$', views.show_paste),
    re_path(r'^([0-9]{7})/([a-fA-F0-9]{32})$', views.remove_paste),
]