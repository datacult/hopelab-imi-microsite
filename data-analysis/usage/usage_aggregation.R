setwd("/Users/aminabrown/Documents/hopelab-imi/")
dataset = read.csv("page_by_region.csv")
states = read.csv("us_states.csv")
mapping = read.csv("page_mapping.csv")

library(dplyr)

dataset = dataset[(dataset$Region %in% states$State),c("Page.path.and.screen.class","Region", "Views", "Average.engagement.time")]

colnames(dataset) <- c("path","state","views","avg_time")

dataset$join = paste(dataset$state,dataset$path,sep = '')

combos = merge(states, mapping, all = TRUE)

combos$join = paste(combos$State,combos$path,sep = '')

mapped = merge(combos, dataset, by = "join", all.x = TRUE)

usage = mapped[ , c("section", "State", "Subsection", "section_name","Type", "views", "avg_time")]

usage[is.na(usage)] <- 0

colnames(usage) <- c("page","state","section","name","content","views","avg_time")

write.csv(usage,"usage.csv", row.names = FALSE)

max(usage$avg_time)

#explore
totals = aggregate(mapped$Views, list(mapped$section), FUN=sum) 

avgs_subsection = aggregate(mapped$Average.engagement.time, list(mapped$section, mapped$Subsection), FUN=mean) 
avgs_subsection = avgs_subsection[avgs_subsection$Group.1 != "LGBTQ101" & avgs_subsection$Group.2 != "", ]

avgs_type = aggregate(mapped$Average.engagement.time, list(mapped$section, mapped$Type), FUN=mean) 
avgs_type = avgs_type[avgs_type$Group.1 != "LGBTQ101" & avgs_type$Group.2 != "", ]

# write.csv(avgs_subsection,"avgs_subsection.csv", row.names = TRUE)

# write.csv(avgs_type,"avgs_type.csv", row.names = TRUE)

# library
library(ggplot2)

# Grouped
ggplot(avgs_type, aes(fill=Group.2, y=x, x=Group.1)) + 
  geom_bar(position="dodge", stat="identity")

ggplot(avgs_subsection, aes(fill=Group.2, y=x, x=Group.1)) + 
  geom_bar(position="dodge", stat="identity")

ggplot(totals, aes(y=x, x=Group.1)) + 
  geom_bar(position="dodge", stat="identity")
