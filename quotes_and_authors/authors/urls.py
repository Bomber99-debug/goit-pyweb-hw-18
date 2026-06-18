from django.urls import path
from . import views

app_name = 'authors'

urlpatterns = [
		path('', views.authors, name='authors'),
		path('add_author/', views.add_author, name='add_author'),
		]