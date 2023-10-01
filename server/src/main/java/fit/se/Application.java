package fit.se;

import java.util.Date;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import fit.se.models.User;
import fit.se.repositories.UserRepository;

@SpringBootApplication(scanBasePackages = { "fit.se.controllers", "fit.se.models", "fit.se.services",
		"fit.se.repositories", "fit.se.util", "fit.se.configs", "fit.se.dto", "fit.se.exceptions" })
public class Application {
	@Bean
	public ModelMapper modelMapper() {
		return new ModelMapper();
	}

	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}

	// @Bean
	public CommandLineRunner run(UserRepository userRepo) throws Exception {
		return args -> {
			List<User> users = userRepo.findAll();
			Date currDate = new Date();
			for (User user : users) {
				Date date = user.getCreatedAt();
				long diff = currDate.getTime() - date.getTime();
				long diffDays = diff / (24 * 60 * 60 * 1000);
				if (diffDays > 30 && user.getVerificationCode() != null) {
					// userRepo.delete(user);
				}
			}

		};
	}
}
