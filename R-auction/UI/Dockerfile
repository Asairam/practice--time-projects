## STAGE 1: Build ###



# We label our stage as ‘builder’



FROM node:10.17.0-alpine as builder



WORKDIR /app

COPY package.json package-lock.json ./



## Storing node modules on a separate layer will prevent unnecessary npm installs at each build

RUN npm i

COPY . .



## Build and store the artifacts in dist folder, for production use --production flag



RUN npm install -g @angular/cli


RUN ng build --base-href /rauction/ --prod --configuration=dev

#RUN ng build
#RUN ng build





### STAGE 2: Setup ###

FROM nginx:1.15.1-alpine



## Copy our default nginx config

COPY app-config.conf /etc/nginx/conf.d/





## Remove default nginx website

RUN rm -rf /usr/share/nginx/html/*





## From ‘builder’ stage copy over the artifacts in dist folder to default nginx public folder

COPY --from=builder /app/dist/RA_AJ_PnCAuctionMobileUI /usr/share/nginx/html

WORKDIR /usr/share/nginx/html/rauction

COPY --from=builder /app/dist/RA_AJ_PnCAuctionMobileUI .



EXPOSE 80





CMD ["nginx", "-g", "daemon off;"]



