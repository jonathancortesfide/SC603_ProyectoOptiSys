# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy solution and project files
COPY ["Softlithe.ERP.sln", "."]
COPY ["Softlithe.ERP.Api/Softlithe.ERP.Api.csproj", "Softlithe.ERP.Api/"]
COPY ["Softlithe.ERP.Abstracciones/Softlithe.ERP.Abstracciones.csproj", "Softlithe.ERP.Abstracciones/"]
COPY ["Softlithe.ERP.BC/Softlithe.ERP.BC.csproj", "Softlithe.ERP.BC/"]
COPY ["Softlithe.ERP.BW/Softlithe.ERP.BW.csproj", "Softlithe.ERP.BW/"]
COPY ["Softlithe.ERP.DA/Softlithe.ERP.DA.csproj", "Softlithe.ERP.DA/"]

# Restore dependencies
RUN dotnet restore "Softlithe.ERP.sln"

# Copy all source files
COPY . .

# Build the project
RUN dotnet build "Softlithe.ERP.sln" -c Release -o /app/build

# Publish stage
FROM build AS publish
RUN dotnet publish "Softlithe.ERP.Api/Softlithe.ERP.Api.csproj" -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app

# Install curl for health checks
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Copy published app from publish stage
COPY --from=publish /app/publish .

# Set environment variables
ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:8080/api/health || exit 1

# Run the application
ENTRYPOINT ["dotnet", "Softlithe.ERP.Api.dll"]
