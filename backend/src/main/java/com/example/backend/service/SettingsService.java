package com.example.backend.service;

import com.example.backend.persistence.entity.AppSetting;
import com.example.backend.persistence.repository.AppSettingRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class SettingsService {

    private static final String BOOKINGS_ENABLED_KEY = "bookings_enabled";
    private final AppSettingRepository repo;

    public SettingsService(AppSettingRepository repo) {
        this.repo = repo;
    }

    public boolean isBookingsEnabled() {
        Optional<AppSetting> opt = repo.findById(BOOKINGS_ENABLED_KEY);
        if (opt.isEmpty()) {
            return true;
        }
        return Boolean.parseBoolean(opt.get().getSettingValue());
    }

    public boolean setBookingsEnabled(boolean enabled) {
        repo.save(new AppSetting(BOOKINGS_ENABLED_KEY, Boolean.toString(enabled)));
        return enabled;
    }
}