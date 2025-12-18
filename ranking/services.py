from accounts.models import User
from academy.models import Enrollment


def compute_ranking():
    data = []

    for user in User.objects.all():
        score = Enrollment.objects.filter(user=user).count()
        data.append({
            "username": user.username,
            "university": getattr(user, 'university', ''),
            "score": score
        })

    return sorted(data, key=lambda x: x['score'], reverse=True)
