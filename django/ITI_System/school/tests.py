from django.test import TestCase

# Create your tests here.
class LoginTestPage(TestCase):
    def test_existance(self):
        self.assertEqual(self.client.get('/school/login/').status_code,200)



# # FLow: Django auto. make this
# create temp test db
# run test against it
# destroy it after
# so my real db isn't touched