from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.forms import AuthenticationForm, UserCreationForm

from .forms import PasteForm
from .models import Paste

# Create your views here.
def index(request):
    return render(request, "index.html", {
        "logged_in": request.user.is_authenticated
    })

def log_in(request):
    if request.POST:

        result = { "success": False }

        form = AuthenticationForm(request, request.POST)

        if form.is_valid():
            login(request, form.get_user())
            result["success"] = True
        else:
            result["errors"] = {}
            errors = form.errors.as_data()

            for field in errors:
                result["errors"][field] = []

                for error in errors[field]:
                    result["errors"][field].append(error.code)

        return JsonResponse(result)

    else: return redirect("/")

def sign_up(request):
    if request.POST:

        result = { "success": False }

        form = UserCreationForm(request.POST)

        if form.is_valid():

            form.save()

            username = form.cleaned_data.get('username')
            raw_password = form.cleaned_data.get('password1')
            user = authenticate(username=username, password=raw_password)

            login(request, user)

            result["success"] = True

        else:
            result["errors"] = {}
            errors = form.errors.as_data()

            for field in errors:
                result["errors"][field] = []

                for error in errors[field]:
                    result["errors"][field].append(error.code)

        return JsonResponse(result)

    else: return redirect("/")

def log_out(request):
    logout(request)
    return redirect("/")

def create_paste(request):
    if request.POST:

        result = { "success": False }
        form = PasteForm(request.POST)

        if form.is_valid():
            guest = not request.user.is_authenticated
            poster = None

            if not guest:
                poster = request.user

            paste = form.save(guest=guest, user=poster)

            result["success"] = True
            result["url"] = "/" + paste.slug

            paste.save()

        return JsonResponse(result)

    else: return redirect("/")

def show_paste(request, slug):
    
    pastes = Paste.objects.filter(slug=slug)

    context = {
        "logged_in": request.user.is_authenticated,
        "found": False,
        "slug": slug
    }

    if len(pastes) == 1:
        paste = pastes[0]

        context["found"] = True
        context["text"] = paste.text
        context["date"] = paste.date

        if paste.guest:
            context["poster"] = "a guest"
        else:
            context["poster"] = paste.poster.username

    return render(request, "paste.html", context)

def remove_paste(request, slug, key):
    pastes = Paste.objects.filter(slug=slug, remove_key=key)
    if len(pastes) == 1: pastes.delete()
    return redirect(request.GET.get("next", "/"))

def list_pastes(request):
    if not request.user.is_authenticated:
        return redirect("/")

    context = { "logged_in": True }
    pastes = Paste.objects.filter(poster=request.user).exclude(slug="")

    context["results_found"] = len(pastes) > 0
    context["results"] = []

    for paste in pastes:
        context["results"].append({
            "url": "/" + paste.slug,
            "remove_url": "/" + paste.slug + "/" + paste.remove_key + "?next=/pastes",
            "text": paste.text,
            "summary": paste.text[:50] + "..."
        })

    return render(request, "pastes.html", context)
