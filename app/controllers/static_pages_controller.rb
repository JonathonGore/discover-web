class StaticPagesController < ApplicationController
  include SessionsHelper

  def about
  end

  def home
    @logged_out = !logged_in?
  end

  def help
  end

  def contact
  end
end
