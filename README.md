# Car-Service-Cms

System CMS do zarządzania stroną serwisu samochodowego. Zawiera panel administratora, interfejs użytkownika oraz backend z dokumentacją API.

**Autorzy:** Franciszek Szaniecki, Adrian Aleksanderek

## Uruchomienie

Aplikację uruchamiamy za pomocą `docker-compose`. Plik `docker-compose.yml` znajduje się w głównym katalogu projektu. Uruchomienie podnosi następujące komponenty:

- Baza danych (PostgreSQL) – port: jdbc:mysql://localhost:3306
- Backend (Spring Boot) – port: http://localhost:8080
- Frontend admin-panel – port: http://localhost:5173
- Frontend client – port: http://localhost:5174

## Testowanie panelu administratora

Do panelu administratora może zalogować się tylko użytkownik z rolą `ADMIN`. Domyślnie nowi użytkownicy mają rolę `USER`.

Po zalogowaniu jako użytkownik z rolą `DEV`, dostępna jest dokumentacja API (Swagger) pod adresem:  
[http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)

<details> 
  <summary>USER: ADMIN</summary>
  UserName/Email:rnowak2@gmail.com
   Hasło:secret@pass12!2
</details>
<details> 
  <summary>USER: USER</summary>
  UserName/Email:jnowak@gmail.com
   Hasło:secret@pass12!
</details>
<details> 
  <summary>USER: DEV</summary>
  UserName/Email:fnowak@gmail.com
   Hasło:secret@pass12!3
</details>
