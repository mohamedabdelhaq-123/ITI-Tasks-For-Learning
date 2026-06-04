from odoo import models, fields



class Doctor(models.Model):
    _name='hms.doctor'

    _rec_name='first_name'
    first_name= fields.Char('First Name',required=True)
    last_name= fields.Char('Last Name',required=True)
    image= fields.Binary('Image')