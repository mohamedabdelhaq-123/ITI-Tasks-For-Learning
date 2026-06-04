{
    'name' : 'Hospital Management System',
    'version': '1.0',
    'summary': 'HMS module',
    'data':[
        'security/groups.xml',
        'views/hms_patient_views.xml',
        'views/hms_department_views.xml',
        'views/hms_doctor_views.xml',
        'views/res_partner_views.xml',
        'security/ir.model.access.csv',
        'security/record_rules.xml',
        'reports/hms_patient_report.xml',
    ],
    'depends': ['base','mail','crm'],  
    'installable': True,
    'application': True, 

}