# Github Pages

Uses docker for the dev work

``` bash
docker build -t awead.github.io .
```

Then run it locally:

``` bash
docker run -v $(pwd):/app -w /app -p 4000:4000 -ti awead.github.io
```
