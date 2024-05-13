require 'rally'

task :post_build_info_to_rally do
  if ENV['USER'] == 'jenkins' then
    begin
      Rally.update_rally_based_on_change
    rescue
      puts "[warning] update rally error."
    ensure
    end
  end
end