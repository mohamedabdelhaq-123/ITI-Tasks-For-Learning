from odoo import models, fields, api
from odoo.exceptions import ValidationError

class ResPartner(models.Model):
    _inherit = 'res.partner'

    related_patient_id = fields.Many2one('hms.patient', string="Related Patient")

    @api.constrains('related_patient_id')
    def _check_unique_patient_email_per_customer(self):
        for partner in self:
            if not partner.id or not isinstance(partner.id, int):
                continue
                
            if partner.related_patient_id and partner.related_patient_id.email:
                patient_email = partner.related_patient_id.email
                
                duplicate_customer = self.env['res.partner'].search([
                    ('related_patient_id', '=', partner.related_patient_id.id),
                    ('id', '!=', partner.id)
                ], limit=1)
                
                if duplicate_customer:
                    raise ValidationError(
                        "Cannot link this patient: the email '%s' is already used by another customer." 
                        % patient_email
                    )
