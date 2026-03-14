# What are you doing here?

This is all the code for my website. Unless you meant to be here, [go to my website](http://jwalk.io/projects), dingus.

## Local Jekyll setup

This site uses Jekyll from the `docs/` directory, not the repo root.

### Normal workflow

Run these commands from a fresh shell:

```sh
chruby ruby-3.2.0
chruby

cd docs
bundle install
bundle exec jekyll serve
```

Notes:

- Do not use the system Ruby for this project.
- If `chruby` shows `* ruby-3.2.0`, the right Ruby is active.
- `bundle install` must be run from `docs/` because `docs/Gemfile` is the project's Gemfile.
- Gems install locally under `docs/vendor/bundle` because of `docs/.bundle/config`.

### If `chruby` is not loaded yet

If the `chruby` command is missing in a new shell, load it first:

```sh
source /opt/homebrew/opt/chruby/share/chruby/chruby.sh
```

## SSL / OpenSSL fix

At one point the local Ruby stopped working and `bundle install` failed with an OpenSSL error. The problem was not Bundler itself: the custom `ruby-3.2.0` install had been built against an older Homebrew OpenSSL library that no longer existed.

The failure looked like this:

```text
Could not load OpenSSL.
You must recompile Ruby with OpenSSL support.
```

We fixed it by reinstalling `ruby-3.2.0` and explicitly linking it against Homebrew `openssl@3`.

```sh
sudo xcodebuild -license accept
brew install chruby ruby-install openssl@3
ruby-install ruby 3.2.0 -- --with-openssl-dir="$(brew --prefix openssl@3)"
```

After that, switch back to the custom Ruby and continue with the normal workflow:

```sh
chruby ruby-3.2.0
cd docs
bundle install
bundle exec jekyll serve
```
