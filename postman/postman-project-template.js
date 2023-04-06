/*

Create New Project from Template:

----

curl 'https://developer.api.autodesk.com/bim360/admin/v1/projects/88d0e47f-bde7-4339-86cb-838b644529e6' \
-X 'GET' \
-H 'Pragma: no-cache' \
-H 'Accept: application/json, text/plain ' \
-H 'Authorization: Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IlU3c0dGRldUTzlBekNhSzBqZURRM2dQZXBURVdWN2VhIn0.eyJzY29wZSI6WyJhY2NvdW50OnJlYWQiLCJhY2NvdW50OndyaXRlIiwiYnVja2V0OmNyZWF0ZSIsImJ1Y2tldDpyZWFkIiwiYnVja2V0OnVwZGF0ZSIsImJ1Y2tldDpkZWxldGUiLCJkYXRhOnJlYWQiLCJkYXRhOndyaXRlIiwiZGF0YTpjcmVhdGUiLCJkYXRhOnNlYXJjaCIsInVzZXI6cmVhZCIsInVzZXI6d3JpdGUiLCJ1c2VyLXByb2ZpbGU6cmVhZCIsInZpZXdhYmxlczpyZWFkIl0sImNsaWVudF9pZCI6InhxcjNjdlJwcDZMTWRCWEhGSzNrZ2tYUjc4WHZCeUZ6IiwiYXVkIjoiaHR0cHM6Ly9hdXRvZGVzay5jb20vYXVkL2Fqd3RleHA2MCIsImp0aSI6IkdBSFNmZzVGRnczZ2VJOE50NklmMWF6RFZwWU9XN2M4cUVvYU5DQzRDck8wZ0FvdXFVV1ZWN2FEQlFXZzJIRGoiLCJ1c2VyaWQiOiIyMDA4MTEyMDA0MDc4MDQiLCJleHAiOjE2NjU3MDEwMDR9.BnYah--EJXOgfCcqG2WwkWK4Q_KxQT4Zdx_RXwowE6_d - EYX - eMQy6j_rFN9azgxbcsYlyXZZuWswSXCuwh2o0TvOn4cS4EHJj2JqjpkIDeR6ifQu9b4SX01hXSZc7qGP2dzqzTYSRgxSLPGb4Win8cF7Ie_jTIuMcJXWKTRIxKeVqQMQ - SN28di_lfA7F676o6JMl0Y2 - yE38rdf7aNYbzVbb_gqBHToM1HIQ5vh1VHcDnPI78qaG6dnpISBbhjfannQhfgOcB6l9tPlNri7NqVEvrX7ysZhvkFjz - zS98x85bNMn - 40ZiN5xOiGujxFnqbXX3Pmaisg7_piNoH5Q' \
-H 'Accept - Encoding: gzip, deflate, br' \
-H 'Cache - Control: no - cache' \
-H 'Accept - Language: en - US, en; q = 0.9' \
-H 'Host: developer.api.autodesk.com' \
-H 'Origin: https://adminv2.b360.autodesk.com' \
-H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Safari/605.1.15' \
-H 'Connection: keep-alive' \
-H 'Cookie: mp_mixpanel__c=10; _at_id.autodesk.engage.1b21=0a93cbb28061ae70.1664997614.8.1665697450.1665697407.671.2064.; cl-token=zZbK/QMdSCT035pt3JPpcIQmqw9/qwYj/HExAoVYj4wJaNQm7z0f2/1+ut5j2+dMSXhKwP/w/TJBn05EvDALRg==; identity-sso=200811200407804; dtPC=31$80452841_727h-vPADHEUOFFLHHRHFQJOGMMPEKAJPHKHGD-0e0; rxvt=1665685950273|1665684150273; AKA_A2=A; dtCookie=v_4_srv_31_sn_35EQQEH30J63QFH3O1K84C53RD1R65EJ_app-3Aeb79d9391ead2932_1_ol_0_perc_100000_mul_1; rxVisitor=1665680452844II55COCP9M3KV873BML1S4A016B7D067; dtLatC=23; dtSa=-; cl-flags=cl-kmsi-enabled:1|cl-token-enabled:1' \
-H 'X-ADS-Region: US'


----

	curl 'https://developer.api.autodesk.com/bim360/admin/v1/projects/88d0e47f-bde7-4339-86cb-838b644529e6' \
-X 'PATCH' \
-H 'Content-Type: application/json;charset=utf-8' \
-H 'Pragma: no-cache' \
-H 'Accept: application/json, text/plain' \
-H 'Authorization: Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IlU3c0dGRldUTzlBekNhSzBqZURRM2dQZXBURVdWN2VhIn0.eyJzY29wZSI6WyJhY2NvdW50OnJlYWQiLCJhY2NvdW50OndyaXRlIiwiYnVja2V0OmNyZWF0ZSIsImJ1Y2tldDpyZWFkIiwiYnVja2V0OnVwZGF0ZSIsImJ1Y2tldDpkZWxldGUiLCJkYXRhOnJlYWQiLCJkYXRhOndyaXRlIiwiZGF0YTpjcmVhdGUiLCJkYXRhOnNlYXJjaCIsInVzZXI6cmVhZCIsInVzZXI6d3JpdGUiLCJ1c2VyLXByb2ZpbGU6cmVhZCIsInZpZXdhYmxlczpyZWFkIl0sImNsaWVudF9pZCI6InhxcjNjdlJwcDZMTWRCWEhGSzNrZ2tYUjc4WHZCeUZ6IiwiYXVkIjoiaHR0cHM6Ly9hdXRvZGVzay5jb20vYXVkL2Fqd3RleHA2MCIsImp0aSI6IkdBSFNmZzVGRnczZ2VJOE50NklmMWF6RFZwWU9XN2M4cUVvYU5DQzRDck8wZ0FvdXFVV1ZWN2FEQlFXZzJIRGoiLCJ1c2VyaWQiOiIyMDA4MTEyMDA0MDc4MDQiLCJleHAiOjE2NjU3MDEwMDR9.BnYah--EJXOgfCcqG2WwkWK4Q_KxQT4Zdx_RXwowE6_d-EYX-eMQy6j_rFN9azgxbcsYlyXZZuWswSXCuwh2o0TvOn4cS4EHJj2JqjpkIDeR6ifQu9b4SX01hXSZc7qGP2dzqzTYSRgxSLPGb4Win8cF7Ie_jTIuMcJXWKTRIxKeVqQMQ-SN28di_lfA7F676o6JMl0Y2-yE38rdf7aNYbzVbb_gqBHToM1HIQ5vh1VHcDnPI78qaG6dnpISBbhjfannQhfgOcB6l9tPlNri7NqVEvrX7ysZhvkFjz-zS98x85bNMn-40ZiN5xOiGujxFnqbXX3Pmaisg7_piNoH5Q' \
-H 'Accept-Language: en-US,en;q=0.9' \
-H 'Accept-Encoding: gzip, deflate, br' \
-H 'Cache-Control: no-cache' \
-H 'Host: developer.api.autodesk.com' \
-H 'Origin: https://adminv2.b360.autodesk.com' \
-H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Safari/605.1.15' \
-H 'Content-Length: 181' \
-H 'Connection: keep-alive' \
-H 'Cookie: mp_mixpanel__c=0; _at_id.autodesk.engage.1b21=0a93cbb28061ae70.1664997614.8.1665697450.1665697407.671.2064.; cl-token=zZbK/QMdSCT035pt3JPpcIQmqw9/qwYj/HExAoVYj4wJaNQm7z0f2/1+ut5j2+dMSXhKwP/w/TJBn05EvDALRg==; identity-sso=200811200407804; dtPC=31$80452841_727h-vPADHEUOFFLHHRHFQJOGMMPEKAJPHKHGD-0e0; rxvt=1665685950273|1665684150273; AKA_A2=A; dtCookie=v_4_srv_31_sn_35EQQEH30J63QFH3O1K84C53RD1R65EJ_app-3Aeb79d9391ead2932_1_ol_0_perc_100000_mul_1; rxVisitor=1665680452844II55COCP9M3KV873BML1S4A016B7D067; dtLatC=23; dtSa=-; cl-flags=cl-kmsi-enabled:1|cl-token-enabled:1' \
-H 'X-ADS-Region: US' \
--data - binary '{"services":[{"serviceName":"projectAdministration"},{"serviceName":"documentManagement"},{"serviceName":"insight"}],"template":{"projectId":"711a0ddb-fda9-4350-b6b3-bcb24a9cfb16"}}'


----

curl 'https://developer.api.autodesk.com/bim360/admin/v1/projects/88d0e47f-bde7-4339-86cb-838b644529e6/users' \
-X 'POST' \
-H 'Content-Type: application/json;charset=utf-8' \
-H 'Pragma: no-cache' \
-H 'Accept: application/json, text/plain' \
-H 'Authorization: Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IlU3c0dGRldUTzlBekNhSzBqZURRM2dQZXBURVdWN2VhIn0.eyJzY29wZSI6WyJhY2NvdW50OnJlYWQiLCJhY2NvdW50OndyaXRlIiwiYnVja2V0OmNyZWF0ZSIsImJ1Y2tldDpyZWFkIiwiYnVja2V0OnVwZGF0ZSIsImJ1Y2tldDpkZWxldGUiLCJkYXRhOnJlYWQiLCJkYXRhOndyaXRlIiwiZGF0YTpjcmVhdGUiLCJkYXRhOnNlYXJjaCIsInVzZXI6cmVhZCIsInVzZXI6d3JpdGUiLCJ1c2VyLXByb2ZpbGU6cmVhZCIsInZpZXdhYmxlczpyZWFkIl0sImNsaWVudF9pZCI6InhxcjNjdlJwcDZMTWRCWEhGSzNrZ2tYUjc4WHZCeUZ6IiwiYXVkIjoiaHR0cHM6Ly9hdXRvZGVzay5jb20vYXVkL2Fqd3RleHA2MCIsImp0aSI6IkdBSFNmZzVGRnczZ2VJOE50NklmMWF6RFZwWU9XN2M4cUVvYU5DQzRDck8wZ0FvdXFVV1ZWN2FEQlFXZzJIRGoiLCJ1c2VyaWQiOiIyMDA4MTEyMDA0MDc4MDQiLCJleHAiOjE2NjU3MDEwMDR9.BnYah--EJXOgfCcqG2WwkWK4Q_KxQT4Zdx_RXwowE6_d-EYX-eMQy6j_rFN9azgxbcsYlyXZZuWswSXCuwh2o0TvOn4cS4EHJj2JqjpkIDeR6ifQu9b4SX01hXSZc7qGP2dzqzTYSRgxSLPGb4Win8cF7Ie_jTIuMcJXWKTRIxKeVqQMQ-SN28di_lfA7F676o6JMl0Y2-yE38rdf7aNYbzVbb_gqBHToM1HIQ5vh1VHcDnPI78qaG6dnpISBbhjfannQhfgOcB6l9tPlNri7NqVEvrX7ysZhvkFjz-zS98x85bNMn-40ZiN5xOiGujxFnqbXX3Pmaisg7_piNoH5Q' \
-H 'Accept-Language: en-US,en;q=0.9' \
-H 'Accept-Encoding: gzip, deflate, br' \
-H 'Cache-Control: no-cache' \
-H 'Host: developer.api.autodesk.com' \
-H 'Origin: https://adminv2.b360.autodesk.com' \
-H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Safari/605.1.15' \
-H 'Content-Length: 229' \
-H 'Connection: keep-alive' \
-H 'Cookie: mp_mixpanel__c=1; _at_id.autodesk.engage.1b21=0a93cbb28061ae70.1664997614.8.1665697450.1665697407.671.2064.; cl-token=zZbK/QMdSCT035pt3JPpcIQmqw9/qwYj/HExAoVYj4wJaNQm7z0f2/1+ut5j2+dMSXhKwP/w/TJBn05EvDALRg==; identity-sso=200811200407804; dtPC=31$80452841_727h-vPADHEUOFFLHHRHFQJOGMMPEKAJPHKHGD-0e0; rxvt=1665685950273|1665684150273; AKA_A2=A; dtCookie=v_4_srv_31_sn_35EQQEH30J63QFH3O1K84C53RD1R65EJ_app-3Aeb79d9391ead2932_1_ol_0_perc_100000_mul_1; rxVisitor=1665680452844II55COCP9M3KV873BML1S4A016B7D067; dtLatC=23; dtSa=-; cl-flags=cl-kmsi-enabled:1|cl-token-enabled:1' \
-H 'X-ADS-Region: US' \
--data - binary '{"email":"Michael.Beale@autodesk.com","services":[{"serviceName":"projectAdministration","access":"administrator"},{"serviceName":"documentManagement","access":"administrator"},{"serviceName":"insight","access":"administrator"}]}'

*/