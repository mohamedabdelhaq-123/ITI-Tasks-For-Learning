from odoo import models,fields

class Department(models.Model):
    _name='hms.department'

    _rec_name='name'
    name= fields.Char('Name')
    capacity= fields.Integer('Capacity')
    is_opened=fields.Boolean('Is_Opened')
    # relation with patients
    department_patient_ids= fields.One2many('hms.patient', inverse_name='patient_department_ids')



