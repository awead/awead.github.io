FROM ruby
WORKDIR /app
COPY ./ /app
RUN gem install bundler -v "2.7.1"
RUN bundle install
CMD ["jekyll", "serve", "--host", "0.0.0.0", "--watch", "--drafts"]
