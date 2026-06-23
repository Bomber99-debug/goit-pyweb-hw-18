from django.core.paginator import Paginator
from django.shortcuts import render,redirect
from django.contrib.auth.decorators import login_required

from .forms import QuoteForm
from .models import Quote
from authors.models import Author
from tags.models import Tag


# Create your views here.
def index(request):
	quotes = Quote.objects.all()
	authors = Author.objects.all()
	tags = Tag.objects.all()

	paginator = Paginator(quotes, 10)
	print(f'paginator: {paginator}')
	print(f'paginator: {paginator.num_pages}')
	page = request.GET.get('page')
	quotes = paginator.get_page(page)
	print(quotes)
	return render(
			request,
			'quotes/index.html',
			{
					'quotes' : quotes,
					'authors': authors,
					'tags'   : tags,
					},
			)

@login_required
def add_quote(request):
	form = QuoteForm()
	if request.method == 'POST':
		form = QuoteForm(request.POST)
		if form.is_valid():
			form.save()
			return redirect(to='quotes:add_quote')
	return render(request, 'quotes/add_quote.html', { 'form': form })
