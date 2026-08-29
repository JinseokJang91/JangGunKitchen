package com.janggunkitchen;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class JangGunKitchenApplication {

	public static void main(String[] args) {
		SpringApplication.run(JangGunKitchenApplication.class, args);
	}
}
