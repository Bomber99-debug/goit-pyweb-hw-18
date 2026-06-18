from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .forms import MongoDBImportForm
from .services import import_data


# Create your views here.
@login_required
def external_sources(request):
	return render(request, 'external_sources/external_sources.html')


@login_required
def mongo_import(request):
	form = MongoDBImportForm()
	if request.method == 'POST':
		form = MongoDBImportForm(request.POST)
		if form.is_valid():
			data = form.cleaned_data
			import_data(data)
			messages.success(request, 'Дані успішно імпортовано')
	return render(request, 'external_sources/mongo_import.html', { 'form': form })
