package main

import (
	"context"
	"fmt"
	"os/exec"
	"time"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx context.Context
}

// PingResult struct
type PingResult struct {
	Success bool   `json:"success"`
	Output  string `json:"output"`
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
	go a.startPinging(ctx)
}

// startPinging sends a ping every 30 seconds
func (a *App) startPinging(ctx context.Context) {
	for {
		pingResult := a.ping("192.168.178.1") // Replace with your internal IP
		runtime.EventsEmit(ctx, "pingResult", pingResult)
		time.Sleep(30 * time.Second)
	}
}

// ping executes the ping command and returns the output
func (a *App) ping(ip string) PingResult {
	out, err := exec.Command("ping", "-c", "1", ip).Output()
	if err != nil {
		return PingResult{
			Success: false,
			Output:  fmt.Sprintf("Error: %s", err),
		}
	}
	return PingResult{
		Success: true,
		Output:  string(out),
	}
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}
