1. Wstęp 
Projekt Dziennik elektroniczny to aplikacja webowa służąca do prowadzenia 
elektronicznej ewidencji zajęć szkolnych, ocen, frekwencji. Repozytorium zawiera 
zarówno część backendową w języku C#, jak i frontendową w języku TypeScript/React 
oraz używa bazę danych MySQL, co pozwala na pełne wdrożenie i uruchomienie 
systemu w środowisku lokalnym lub testowym.  
W dokumentacji zostaną opisane: 
• wymagania techniczne 
• przygotowanie środowiska 
• proces wdrożenia 
• sprawdzenie działania 

2. Wymagania 
Aby możliwe było poprawne uruchomienie projektu w środowisku lokalnym, 
konieczne jest spełnienie następujących wymagań: 
• Komputer z dostępem do Internetu 
• Minimum 4 GB pamięci RAM  
• Co najmniej 2 GB wolnego miejsca na dysku 
• System operacyjny: 
o Windows 10/11 
o Linux  
o macOS  
• Przeglądarka internetowa 
Wymagania programowe 
• .NET SDK – do uruchomienia części backendowej 
• Node.js – do uruchomienia części frontendowej 
• MySQL – do przechowywania danych aplikacji (najlepiej XAMP z phpMyAdmin) 
• Menedżer pakietów npm  
• Git – do pobrania projektu z repozytorium 

3. Przygotowanie środowiska 
Instalacja wymaganych narzędzi 
• Git – pobierz i zainstaluj https://git-scm.com 
• .NET SDK (aplikacja działa na .NET 8) – pobierz i zainstaluj 
https://dotnet.microsoft.com/en-us/download/dotnet/8.0 
• Node.js + npm – pobierz i zainstaluj https://nodejs.org 
• phpMyAdmin – do wygodnego zarządzania bazą danych przez przeglądarkę. 
Można go pobrać razem z pakietem XAMPP: 
https://www.apachefriends.org/index.html 
Pobranie projektu 
• Otwórz terminal i przejdź do katalogu, w którym chcesz umieścić projekt. 
• Sklonuj repozytorium: 
• git clone https://github.com/Nomislaw/Dziennik_elektroniczny.git 
• Przejdź do katalogu projektu: 
• cd Dziennik_elektroniczny 

4. Proces wdrożenia 
4.1. Baza danych 
• W XAMP uruchom Apache i MySQL i wejdź w phpMyAdmin (przycisk “Admin” 
przy MySQL). 
• Utwórz bazę danych o nazwie dziennik_elektroniczny_db; 
• W phpMyAdmin wejdź w bazę danych następnie przejdź do zakładki import i 
wybierz plik z repozytorium „dziennik_elektroniczny_db.sql”. Potem kliknij 
“Import”, a stworzy się cała baza danych. 
• W pliku Dziennik_elektroniczny->Dziennik_elektroniczny->appsettings.json 
ustaw poprawne połączenie. Jeśli wszystko zrobiłeś poprawnie to nie ma 
potrzeby nic zmieniać. 
4.2. Backend  
• Otwórz terminal i przejdź do katalogu backendu w projekcie  
o cd Dziennik_elektroniczny 
• Sprawdź, czy zainstalowane jest .NET SDK: 
o dotnet –version (Aplikacja działa na .NET 8) 
• Uruchom backend w terminalu: 
o dotnet run 
• Po poprawnym uruchomieniu backend nasłuchuje na wskazanym porcie (np. 
http://localhost:5000).  
• Sprawdz czy frontend się komunikuje z tym portem. Wejdź do 
Dziennik_elektroniczny->frontend->src->api->api.ts. Sprawdz czy zmienna 
„URL” jest zgodna z nasłuchiwanym portem. Jeśli jest problem z SSL Protocol 
Error, wtedy zmień https na http. 
4.3. Frontend  
• Przejdź do katalogu frontend: 
o cd frontend 
• Zainstaluj zależności: 
o npm install 
• Uruchom aplikację frontendową: 
o npm start 
• Aplikacja powinna być dostępna pod adresem: http://localhost:3000 

5. Sprawdzenie działania 
Po poprawnym uruchomieniu backendu, frontendu i bazy danych należy sprawdzić, 
czy aplikacja działa prawidłowo. 
• Otwórz przeglądarkę i wpisz adres frontendowy: http://localhost:3000. Strona 
powinna się poprawnie załadować. Następnie zaloguj się na dowolne konto 
testowe lub stwórz nowe konto.