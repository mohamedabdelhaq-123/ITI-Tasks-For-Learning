import re

from odoo import models, fields,api
from datetime import date
from odoo.exceptions import ValidationError

class Patient(models.Model):
    _name = 'hms.patient'
    _rec_name= 'first_name'
    # _inherit='hms.patient'

    first_name = fields.Char('First Name', required=True)
    last_name = fields.Char('Last Name',required=True)
    email= fields.Char('Email')
    birth_date = fields.Date('Birth Date')
    history = fields.Html('History')
    cr_ratio = fields.Float('CR Ratio')
    blood_type = fields.Selection([('A+', 'A+'), ('A-', 'A-'), ('B+', 'B+'), ('B-', 'B-')], "Blood Type")
    pcr = fields.Boolean('PCR')
    image = fields.Binary('Image')
    address = fields.Text('Address')
    # age = fields.Integer('Age')
    age = fields.Integer('Age', compute='_compute_age', store=True, readonly=True)
    status = fields.Selection([('undetermined', 'Undetermined'),('good',"Good"),('fair','Fair'),('serious','Serious')])
    patient_department_ids = fields.Many2one('hms.department') # m:1 bec dept. capacity logically won't be calculated for mult. dept. 
    department_capacity = fields.Integer(related='patient_department_ids.capacity')
    department_opened = fields.Boolean(related='patient_department_ids.is_opened')
    patient_doctor_ids= fields.Many2many('hms.doctor') #odoo creates table auto. and m2m is made in one class only
    # the m2m is not shown in the UI but in background

    _sql_constraints = [
        ('unique_patient_email', 'UNIQUE(email)', 'This email address is already registered')
    ]

    # @api.onchange('age')
    # def _onchange_age(self):
    #     if self.age < 30:
    #         self.pcr = True
    #         return {
    #             'warning': {
    #                 'title': "PCR Checked",
    #                 'message': "The PCR field has been automatically checked because the age is lower than 30.",
    #             }
    #         }


    @api.depends('birth_date')
    def _compute_age(self):
        today = date.today()
        for record in self:
            if record.birth_date:
                record.age = today.year - record.birth_date.year - (
                    (today.month, today.day) < (record.birth_date.month, record.birth_date.day)
                )
            else:
                record.age = 0

    @api.constrains('email')
    def _check_valid_email(self):
        for record in self:
            if record.email:
                email_regex = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                if not re.match(email_regex, record.email):
                    raise ValidationError("The email format is invalid!")
                









# lab 4
# Continue with our previously created module "hms"
# Create two new user groups (user, manager)
# The user group has the following access rights:
# Can create/read/update his own patients records
# Can read only departments
# Can read only doctors
# Can't view doctor fields in patients' form view
# Can't view doctors' menu item

# OPEN SOURCE DEPARTMENT
# HMS (Hospitals Management System):
# The Manager group has the following access rights:
# Can create/read/update/delete all patients records
# Can create/read/update/delete departments
# Can create/read/update/delete doctors
# Can view doctor fields in patients form view
# Can view doctors menu item
