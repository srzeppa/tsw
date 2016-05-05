# tsw
Technologie Sieci Web - University of Gdansk

Baza danych – z danymi zawodników. 



###Aplikacja webowa służy do: 

    Obsługi danych zawodów (wyniki etc.) 

 

###Trzy interfejsy: 

Interfejs administratora  

* Bezpieczne połączenie 

* Websockets + http ssl 

Interfejs dla widzów (livescore) 

* Protokół websockets + http 

Interfejs dla sędziów (do oceny zawodników, wpisują na koniec meczu (z tabletów z połączeniem obustronnym z serwerem) 

* Administrator upewnia się, że wyniki zostały wystawione, a po ich wystawieniu zamyka możliwość wystawiania ocen, w razie opóźnień pospiesza sędziego 

* Websockets + ssl 

* Wyniki zawodników muszą być zapamiętane i możliwe do odtworzenia 

* Oceny w skali liczbowej = ostateczna ocena to średnia z tych ocen od wszystkich sędziów (do budowania rankingu) 

     

Technologia: 

Baza danych: MongoDB, 

Serwer: NodeJS
