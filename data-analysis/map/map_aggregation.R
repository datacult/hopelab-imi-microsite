library(dplyr)
setwd("/Users/aminabrown/Documents/hopelab-imi/")
locations = read.csv("HopelabMapRaw.csv")
states = read.csv("StateCodes.csv")
latlong = read.csv("worldcities.csv")
latlong = latlong[latlong$country == "United States",]

location_states = merge(locations, states, by.x = "State", by.y = "Code")
#excluded = locations[!(locations$State %in% location_states$State), ]

location_latlong = merge(location_states, latlong, by.x = c("City","State.y"), by.y = c("city","admin_name"))
excluded_latlong = location_states[!(location_states$City %in% location_latlong$City), ]
write.csv(excluded_latlong,"missing_cities.csv")

missing = read.csv("missing_cities_latlong.csv")

missing$lng = missing$lng*-1

HopelabMap = bind_rows(location_latlong[c("Organization.Name","City","State","lat","lng","Type")],missing[c("Organization.Name","City","State","lat","lng","Type")])

write.csv(HopelabMap,"/Users/aminabrown/Documents/hopelab-imi/hopelab-imi-microsite/data/map.csv",row.names = FALSE)
