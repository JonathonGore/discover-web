class StaticPagesController < ApplicationController
  include SessionsHelper

  def about
  end

  def home
    @logged_out = !logged_in?
  end

  def create

    # Here we will validate our params and flash all errors
    # move validation to helper method
    if params[:longitude] == ""
      puts "invalid"
    end
    print("test\n")
  end

  def help
  end

  def contact
  end
end
