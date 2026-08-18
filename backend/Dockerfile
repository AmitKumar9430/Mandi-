# ==============================================================================
# STAGE 1: Build the Spring Boot application using Maven
# ==============================================================================
FROM maven:3.9.6-eclipse-temurin-21-alpine AS builder

WORKDIR /build

# Cache dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code and build production jar
COPY src ./src
RUN mvn clean package -DskipTests -B

# ==============================================================================
# STAGE 2: Lightweight JRE runtime image for production
# ==============================================================================
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Create a non-root user for security
RUN addgroup -S mandi && adduser -S mandi -G mandi

# Copy the built jar from builder stage
COPY --from=builder /build/target/mandi-backend-*.jar app.jar

# Set ownership to non-root user
RUN chown -R mandi:mandi /app
USER mandi

# Default environment variables (can be overridden on Render/Docker)
ENV PORT=8080
ENV SPRING_PROFILES_ACTIVE=prod

EXPOSE 8080

ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-Dserver.port=${PORT}", "-jar", "app.jar"]
