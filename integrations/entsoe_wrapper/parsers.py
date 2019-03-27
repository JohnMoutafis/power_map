from bs4 import BeautifulSoup


def entsoe_error_parser(content):
    soup = BeautifulSoup(content.decode('utf-8'), features='xml')
    return soup.find('Reason').find('text').get_text()


def entsoe_content_parser(content):
        soup = BeautifulSoup(content.decode('utf-8'), features='xml')

        time_series = soup.find('TimeSeries')
        for point in time_series.find_all('Point'):
            print('{}: {}'.format(point.find('position').get_text(), point.find('quantity').get_text()))
