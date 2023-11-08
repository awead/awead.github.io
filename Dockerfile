FROM ruby
WORKDIR /app
COPY ./ /app
RUN gem install bundler
RUN bundle install
CMD ["jekyll", "serve", "--host", "0.0.0.0", "--watch", "--drafts"]
