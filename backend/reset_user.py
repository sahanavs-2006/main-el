
import os
import sys
import django

# Add backend to path
sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth.models import User
from api.models import UserProfile

def reset_account():
    username = "sahana"
    phone = "8660616847"
    
    print(f"--- Resetting account for {username} / {phone} ---")
    
    # Delete User by username
    try:
        user = User.objects.get(username=username)
        print(f"Found user '{username}' (ID: {user.id}). Deleting...")
        user.delete()
        print("User deleted.")
    except User.DoesNotExist:
        print(f"User '{username}' does not exist.")

    # Delete Profile by phone (and its temp user if any)
    try:
        profile = UserProfile.objects.get(phone_number=phone)
        print(f"Found profile for phone '{phone}'.")
        if profile.user:
            print(f"Deleting associated user '{profile.user.username}'...")
            profile.user.delete()
        else:
            profile.delete()
        print("Profile deleted.")
    except UserProfile.DoesNotExist:
        print(f"Profile for '{phone}' does not exist.")
        
    print("--- Reset Complete ---")

if __name__ == "__main__":
    reset_account()
