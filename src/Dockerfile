FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

COPY pom.xml .
RUN mvn dependency:go-offline

COPY src ./src

RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

RUN mkdir -p /app/images
RUN mkdir -p /app/images/posts

COPY --from=build /app/src/main/resources/images /tmp/images/

ENTRYPOINT ["sh","-c","cp -n /tmp/images/* /app/images/ && java -jar /app.jar"]

EXPOSE 8080

ENTRYPOINT ["java","-jar","app.jar"]