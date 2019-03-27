class EndpointError(Exception):
    """Generic base API exception class."""
    status_code = 500

    def __init__(self, message, status_code=None):
        super().__init__()
        self.message = message
        if status_code:
            self.status_code = status_code

    def __str__(self):
        return str('Error: {}, {}'.format(self.status_code, self.message))


class BadRequest(EndpointError):
    """Custom Exception to be raised if a request sends wrong or malformed payload."""
    status_code = 400


class Unauthorized(EndpointError):
    """Custom Exception to be raised if a request user is not authenticated."""
    status_code = 401


class NotFound(EndpointError):
    """Custom Exception to be raised if a resource was not found."""
    status_code = 404


class MethodNotAllowed(EndpointError):
    """Custom Exception to be raised if a request method is not allowed by the endpoint service."""
    status_code = 405


class ResourceConflict(EndpointError):
    """Custom Exception to be raised if a resource's state is not the expected."""
    status_code = 409


class Unavailable(EndpointError):
    """Custom Exception to be raised if a service was unavailable."""
    pass
