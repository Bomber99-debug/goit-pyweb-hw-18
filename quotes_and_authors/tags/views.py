from django.core.paginator import Paginator
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required

from .forms import TagForm
from .models import Tag


# Create your views here.
def tags(request, ):
	tags = Tag.objects.all()
	paginator = Paginator(tags, 5)
	page = request.GET.get('page')
	tags = paginator.get_page(page)
	return render(request, 'tags/tags.html', { 'tags': tags })


@login_required
def add_tag(request):
	form = TagForm()
	if request.method == 'POST':
		form = TagForm(request.POST)
		if form.is_valid():
			form.save()
			return redirect(to='tags:add_tag')
	return render(request, 'tags/add_tag.html', { 'form': form })
