from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from .models import Author
from .forms import AuthorForm


# Create your views here.
def authors(request):
	authors = Author.objects.all()
	return render(request, 'authors/author.html', context={ 'authors': authors })

@login_required
def add_author(request):
	form = AuthorForm()
	if request.method == 'POST':
		form = AuthorForm(request.POST)
		if form.is_valid():
			form.save()
			return redirect(to='authors:add_author')
	return render(request, 'authors/add_author.html', context={ 'form': form })
