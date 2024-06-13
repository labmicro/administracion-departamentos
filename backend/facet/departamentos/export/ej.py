from django.http import HttpResponse

def simple_response(request):
    return HttpResponse("Funciona correctamente")