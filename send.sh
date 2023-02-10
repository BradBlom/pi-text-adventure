# To use this file open a terminal at this location and enter the
# following command:
# alias send="sudo sh send.sh"
#
# ...then type "send this message" (without quotes) 

#
# curl "http://192.168.1.41:8000/?msg=$1"

curl "http://192.168.1.41:8000/?log_level=debug&msg=$(echo $@ | tr ' ' +)"
