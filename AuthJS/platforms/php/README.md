composer require bcosca/fatfree
docker build -t authjs-php .
docker run -p 8000:80 -e ALLOW_OVERRIDE=true authjs-php
