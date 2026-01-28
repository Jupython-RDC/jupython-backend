from rest_framework import serializers
from .models import User


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    fullname = serializers.CharField(write_only=True, required=False, allow_blank=True)
    promotion = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'university']

    def create(self, validated_data):
        fullname = validated_data.pop('fullname', '')
        # split fullname into first_name and last_name
        first_name = ''
        last_name = ''
        if fullname:
            parts = fullname.strip().split(None, 1)
            first_name = parts[0]
            if len(parts) > 1:
                last_name = parts[1]

        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            university=validated_data.get('university', '')
        )

        # save names if provided
        if first_name or last_name:
            user.first_name = first_name
            user.last_name = last_name
            user.save()

        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'university']
