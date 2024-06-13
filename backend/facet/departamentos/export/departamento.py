from django.http import HttpResponse
from django.views.generic import View
from openpyxl import Workbook
from reportlab.pdfgen import canvas
from ..models import Departamento

class DepartamentoExportExcel(View):
    def get(self, request):
        departamentos = Departamento.objects.all()

        wb = Workbook()
        ws = wb.active
        ws.title = "Departamentos"
        ws.append(['Nombre', 'Teléfono', 'Estado', 'Interno'])

        for departamento in departamentos:
            ws.append([
                departamento.nombre,
                departamento.telefono,
                departamento.estado,
                departamento.interno,
            ])

        response = HttpResponse(content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        response['Content-Disposition'] = 'attachment; filename=departamentos.xlsx'
        wb.save(response)

        return response

class DepartamentoExportPDF(View):
    def get(self, request):
        departamentos = Departamento.objects.all()

        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename=departamentos.pdf'

        p = canvas.Canvas(response)
        p.setFont("Helvetica", 12)

        y = 750
        for departamento in departamentos:
            p.drawString(100, y, f"Nombre: {departamento.nombre}")
            p.drawString(100, y - 20, f"Teléfono: {departamento.telefono}")
            p.drawString(100, y - 40, f"Estado: {departamento.estado}")
            p.drawString(100, y - 60, f"Interno: {departamento.interno}")
            p.drawString(100, y - 80, "-" * 50)
            y -= 100

            if y < 50:
                p.showPage()
                p.setFont("Helvetica", 12)
                y = 750

        p.save()

        return response
