package com.wedding.backend.controller;

import com.wedding.backend.model.Rsvp;
import com.wedding.backend.repository.RsvpRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rsvps")
@CrossOrigin(origins = "*") // Allow frontend to connect
public class RsvpController {

    @Autowired
    private RsvpRepository rsvpRepository;

    @PostMapping
    public ResponseEntity<Rsvp> submitRsvp(@RequestBody Rsvp rsvp) {
        Rsvp savedRsvp = rsvpRepository.save(rsvp);
        return ResponseEntity.ok(savedRsvp);
    }

    @GetMapping
    public ResponseEntity<List<Rsvp>> getAllRsvps() {
        return ResponseEntity.ok(rsvpRepository.findAll());
    }
}
