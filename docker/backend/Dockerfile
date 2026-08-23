# ============================================================
# Stage 1: BUILD STAGE
# ============================================================

FROM eclipse-temurin:25-jdk AS build

WORKDIR /app

# Copy Spring Boot Maven project
COPY BlogApplication/pom.xml .

# Copy source code
COPY BlogApplication/src ./src

# Build application
RUN apt-get update \
    && apt-get install -y maven \
    && mvn clean package -DskipTests \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*


# ============================================================
# Stage 2: PRODUCTION STAGE
# ============================================================

FROM eclipse-temurin:25-jre

WORKDIR /app

# Copy generated Spring Boot JAR
COPY --from=build /app/target/*.jar app.jar

# Spring Boot port
EXPOSE 8080

# Run application
ENTRYPOINT ["java", "-jar", "app.jar"]