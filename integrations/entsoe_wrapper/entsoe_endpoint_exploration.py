from integrations.entsoe_wrapper import errors
from integrations.entsoe_wrapper.services import fetch_entsoe_data


def endpoint_exploration():
    for i in range(1, 100):
        document_type = 'A{}'.format(str(i).zfill(2))
        try:
            response = fetch_entsoe_data(document_type, 'A16')
        except (errors.BadRequest, errors.Unauthorized, errors.NotFound, errors.Unavailable) as exc:
            print('Error {} on document type: {}'.format(exc.message, document_type))
            continue

        return response
