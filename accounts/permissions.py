from rest_framework import permissions

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Permission permettant uniquement au propriétaire d'un profil de le modifier.
    La lecture est autorisée pour tous (ou peut être restreinte).
    """
    def has_object_permission(self, request, view, obj):
        # Les méthodes de lecture (GET, HEAD, OPTIONS) sont autorisées
        if request.method in permissions.SAFE_METHODS:
            return True

        # L'écriture n'est autorisée que si l'utilisateur est le propriétaire
        # On suppose que le modèle de profil a une relation 'user'
        return obj.user == request.user
