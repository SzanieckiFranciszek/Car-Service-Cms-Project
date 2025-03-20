# Etap 1: Budowanie aplikacji
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

# Kopiowanie pom.xml i pobieranie zależności
COPY pom.xml .
RUN mvn dependency:go-offline

# Kopiowanie źródeł aplikacji
COPY src ./src

# Budowanie aplikacji
RUN mvn clean package -DskipTests

# Etap 2: Uruchomienie aplikacji
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Kopiowanie wynikowego JAR z poprzedniego etapu
COPY --from=build /app/target/*.jar app.jar

# Port aplikacji Spring Boot
EXPOSE 8080

# Uruchomienie aplikacji
ENTRYPOINT ["java","-jar","app.jar"]